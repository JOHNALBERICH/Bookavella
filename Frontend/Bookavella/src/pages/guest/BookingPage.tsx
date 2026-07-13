import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomService } from '@/features/room/services/roomService';
import { propertyService } from '@/features/property/services/propertyService';
import { bookingService } from '@/features/booking/services/bookingService';
import { paymentService } from '@/features/payment/services/paymentService';
import { useApplyDiscount } from '@/features/discount/hooks/useDiscount';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';
import { toast } from 'sonner';
import { paymentSchema, PaymentFormValues } from '../../features/booking/libs/schema';
import { CreateBookingRequest, CreatePaymentRequest, ValidatePaymentRequest } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../@/components/ui/form';
import { Input } from '../../../@/components/ui/input';
import { Button } from '../../../@/components/ui/button';
import { Separator } from '../../../@/components/ui/separator';
import { 
  Loader2, CheckCircle2, CreditCard, ArrowLeft, ArrowRight, Tag, Calendar, Users, Home, BookOpen 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingSessionState {
  roomId: string;
  propertyId: string;

  checkIn: string;
  checkOut: string;
  guests: number;

  roomname?: string;
  pricePerNight?: number;
}

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const state = location.state as BookingSessionState | null;
  console.log("BookingPage state:", location.state);
  // Redireciona imediatamente caso as informações de sessão estejam ausentes (Fuga de Rota)

  
  const { roomId = '', propertyId = '', checkIn = '', checkOut = '', guests =1 } = state || {};
  

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');
  const [paymentTypeSelected, setPaymentTypeSelected] = useState<string>('Credit Card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [discountInput, setDiscountCodeInput] = useState<string>('');

  // 1. Hook reativo de controle de descontos (Fase 4 - Task 3)
  const { appliedDiscount, applyDiscount, removeDiscount, computedPrice } = useApplyDiscount();

  // 2. Busca Detalhes do Quarto e da Propriedade em paralelo
  const { data: roomResponse, isLoading: loadingRoom } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomService.getRoomDetails(roomId),
    enabled: !!roomId,
  });

  const { data: propertyResponse, isLoading: loadingProperty } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: () => propertyService.getPropertyDetails(propertyId),
    enabled: !!propertyId,
  });

  const room = roomResponse;
  const property = propertyResponse;
  

  // 3. Formulário de Faturamento do Passo 4
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    mode: 'onBlur',
    defaultValues: {
      paymentType: 'Credit Card',
      cardNumber: '',
      cardHolderName: '',
      expirationDate: '',
      cvv: '',
    },
  });
  console.log({
    loadingRoom,
    loadingProperty,
    roomResponse,
    propertyResponse,
    room,
    property,
});
  if (loadingRoom || loadingProperty || !room || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] px-4 font-body">
        <div className="space-y-4 w-full max-w-[320px] text-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
          <p className="text-xs uppercase tracking-wider text-text-secondary">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Cálculos de Noites e Preço Base
  const calculateNights = () => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const difference = end.getTime() - start.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24));
  };

  const nights = calculateNights();
  const subtotal = nights * room.price;
  const finalPrice = computedPrice(subtotal);

  // 4. PIPELINE DE FATURAMENTO E TRANSAÇÃO EM DUAS ETAPAS (Passo 4)
  const handlePaymentSubmit = async (formValues: PaymentFormValues) => {
    setIsSubmitting(true);
    let activeBookingId = '';

    try {
      // ETAPA 1: Criação da Reserva Temporária (status pending)
      // ◄ SYNC: Envia o CreateBookingRequest com os campos exatos (roomId, discountCode?, checkInDate, checkOutDate, numberOfGuests)
      // O backend descobre o userId pelo JWT e calcula o totalPrice internamente.
      const bookingPayload: CreateBookingRequest = {
        roomId,
        discountCode: appliedDiscount?.discountCode || undefined,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
      };
      console.log("STEP 1");
      const booking = await bookingService.createBooking(bookingPayload);
      
      console.log("BOOKING =", booking);
      console.log("step 1.5");
      activeBookingId = booking.bookingId ?? booking.bookingId ?? (booking as any).bookingId;
      if (!activeBookingId) {
        throw new Error( 'Failed to initialize booking.');
      }

      

      // ETAPA 2: Registro do Faturamento com o Gateway de Pagamentos
      const paymentPayload: CreatePaymentRequest = {
        bookingId: activeBookingId,
        paymentType: formValues.paymentType,
        
      };
      console.log("STEP 2");
      const payment = await paymentService.createPayment(paymentPayload);
      console.log("PAYMENT =", payment);
      const paymentId = payment.paymentId || (payment as any).paymentId;
      if (!paymentId) {
        throw new Error('Payment gateway registration failed.');
      }

     
      

      // ETAPA 3: Validação da Cobrança com o Emissor/Bandeira
      // ◄ SYNC: O ValidatePaymentRequest agora reúne os metadados do cartão completos sem o campo totalAmount
      const validationPayload: ValidatePaymentRequest = {
        bookingId: activeBookingId,
        paymentId,
        paymentType: formValues.paymentType,
        cardNumber: formValues.cardNumber || '',
        cardHolderName: formValues.cardHolderName || '',
        cvv: formValues.cvv || '',
      };
      console.log("STEP 3");
      const validation = await paymentService.validatePayment(validationPayload);
      console.log(validation);
      if (!validation) {
        throw new Error('Payment transaction declined by issuer.');
      }
      console.log("STEP 4");
      // Sucesso Total: Avança para a etapa de confirmação
      setConfirmedBookingId(activeBookingId);
      setCurrentStep(5);
      toast.success('Your reservation is secured!');

    } catch (err) {
      // MECANISMO DE ROLLBACK ATÔMICO: Estorna faturamento e desfaz bloqueio de datas se houver falha
      if (activeBookingId) {
        try {
          await paymentService.cancelPayment(activeBookingId);
        } catch {
          // Silencia falhas internas de reversão em cascata, prioriza o feedback do erro de faturamento principal
        }
      }

      const apiError = err instanceof Error ? err.message : 'Transaction declined. Please check details.';
      toast.error(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Review' },
    { num: 2, label: 'Guests' },
    { num: 3, label: 'Promotion' },
    { num: 4, label: 'Payment' },
    { num: 5, label: 'Confirmed' },
  ];
  console.log({
    room,
    subtotal,
    finalPrice,
});
console.log(JSON.stringify(room, null, 2));
console.log(JSON.stringify(currentUser, null, 2));
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 font-body text-text-primary">
      {/* progress Steps Tracker */}
      <div className="flex items-center justify-between border-b border-border pb-6 overflow-x-auto scrollbar-none">
        {steps.map((s) => (
          <div key={s.num} className="flex items-center gap-2.5">
            <div
              className={cn(
                'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors border',
                currentStep === s.num
                  ? 'bg-accent border-accent text-background'
                  : currentStep > s.num
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-surface border-border text-text-secondary'
              )}
            >
              {s.num}
            </div>
            <span
              className={cn(
                'text-xs font-medium whitespace-nowrap',
                currentStep === s.num ? 'text-accent' : 'text-text-secondary'
              )}
            >
              {s.label}
            </span>
            {s.num < 5 && <span className="text-text-tertiary">/</span>}
          </div>
        ))}
      </div>

      {/* STEP CONTENT PANEL */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* STEP 1: REVIEW SELECTION */}
        {currentStep === 1 && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Review Selection</CardTitle>
              <CardDescription>Confirm your sanctuary selection and booking dates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-background border border-border rounded-sm flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <h4 className="text-base font-medium text-text-primary">{room.roomName}</h4>
                  <p className="text-xs text-text-secondary">{property.name} — {property.city}, {property.country}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary pt-2">
                    <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-accent" /> <span>{checkIn} to {checkOut} ({nights} nights)</span></div>
                    <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-accent" /> <span>{guests} Guests</span></div>
                  </div>
                </div>
                <div className="flex flex-col justify-end text-right border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 shrink-0">
                  <span className="text-[10px] uppercase text-text-tertiary">Per night</span>
                  <span className="font-semibold text-sm">R$ {room.price.toLocaleString('pt-BR')}</span>
                  <span className="text-xs font-bold text-accent mt-1">Subtotal: R$ {subtotal.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setCurrentStep(2)} className="h-10 text-xs px-6 flex items-center gap-2 cursor-pointer">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 2: GUEST DETAILS */}
        {currentStep === 2 && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Guest Details</CardTitle>
              <CardDescription>Verify your hosting profile details and notes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-text-secondary font-medium">Name</label>
                    <Input value={currentUser?.name || ''} disabled className="bg-background opacity-60 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-text-secondary font-medium">Email Address</label>
                    <Input value={currentUser?.email || ''} disabled className="bg-background opacity-60 text-sm" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary font-medium">Phone</label>
                  <Input value={currentUser?.phoneNumber || ''} disabled className="bg-background opacity-60 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-secondary font-medium">Special Requests (Optional)</label>
                  <textarea
                    placeholder="Provide hosting details, check-in times or food requirements..."
                    className="w-full bg-background border border-border rounded-sm text-sm p-3 min-h-[100px] text-text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => setCurrentStep(1)} className="h-10 text-xs flex items-center gap-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="h-10 text-xs px-6 flex items-center gap-2 cursor-pointer">
                  Continue to Promotion <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 3: DISCOUNT PROMOTION */}
        {currentStep === 3 && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Promotion & Discouts</CardTitle>
              <CardDescription>Apply promotional cupons to amortize your booking fees.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center bg-background border border-border rounded-sm h-10 px-3 transition-colors focus-within:border-accent">
                    <Tag className="h-4 w-4 text-text-tertiary mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. SANCTUARY20"
                      value={discountInput}
                      onChange={(e) => setDiscountCodeInput(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-sm focus:outline-none h-full text-text-primary placeholder:text-text-tertiary"
                    />
                  </div>
                  <Button onClick={() => applyDiscount(discountInput)} className="h-10 text-xs cursor-pointer">
                    Apply
                  </Button>
                </div>

                {appliedDiscount && (
                  <div className="p-4 rounded-sm bg-success/10 border border-success/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-success capitalize">{appliedDiscount.discountCode} coupon active</span>
                      <p className="text-[10px] text-text-secondary mt-0.5">Saves {appliedDiscount.discountPercentage}% over total price.</p>
                    </div>
                    <button onClick={removeDiscount} className="text-text-secondary hover:text-error text-xs font-semibold cursor-pointer">
                      Remove
                    </button>
                  </div>
                )}
              </div>
                  
              {/* Price Breakdown */}
              <div className="border-t border-border pt-6 max-w-md space-y-3 font-body text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Subtotal ({nights} nights)</span>
                  <span>R$ {subtotal.toLocaleString('pt-BR')}</span>
                </div>
                {appliedDiscount && (
                  
                  <div className="flex items-center justify-between text-success">
                    <span>Discount (-{appliedDiscount.discountPercentage}%)</span>
                    <span>- R$ {(subtotal * (appliedDiscount.discountPercentage / 100)).toLocaleString('pt-BR')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between font-bold text-sm text-text-primary border-t border-border pt-3">
                  <span>Total Amount</span>
                  <span>R$ {finalPrice.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => setCurrentStep(2)} className="h-10 text-xs flex items-center gap-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setCurrentStep(4)} className="h-10 text-xs px-6 flex items-center gap-2 cursor-pointer">
                  {appliedDiscount ? 'Continue to Payment' : 'Skip Promotion'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* STEP 4: SECURE PAYMENT */}
        {currentStep === 4 && (
          <Card className="bg-surface border-border">
            <CardHeader>
              <CardTitle className="text-lg font-heading">Secure Payment</CardTitle>
              <CardDescription>Select payment method and finalize transaction.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                  {/* Select de Formas de Pagamento */}
                  <FormField
                    control={paymentForm.control}
                    name="paymentType"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Payment Method</FormLabel>
                        <FormControl>
                          <select
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setPaymentTypeSelected(e.target.value);
                            }}
                            className="w-full bg-background border border-border text-sm h-10 px-3 rounded-sm text-text-primary focus:outline-none focus:border-accent"
                          >
                            <option value="Credit Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer (Pix)</option>
                            <option value="E-Wallet">E-Wallet</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campos de Cartão (Se Cartão de Crédito Selecionado) */}
                  {paymentTypeSelected === 'Credit Card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border p-4 rounded-sm bg-background/50">
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-xs font-medium text-text-secondary">Card Number</FormLabel>
                            <FormControl>
                              <Input placeholder="0000 0000 0000 0000" className="bg-background text-sm h-10 border-border" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-error mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="cardHolderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-medium text-text-secondary">Cardholder Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="bg-background text-sm h-10 border-border" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs text-error mt-1" />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={paymentForm.control}
                          name="expirationDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-text-secondary">Exp. Date</FormLabel>
                              <FormControl>
                                <Input placeholder="MM/YY" className="bg-background text-sm h-10 border-border" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs text-error mt-1" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={paymentForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-medium text-text-secondary">CVV</FormLabel>
                              <FormControl>
                                <Input placeholder="000" className="bg-background text-sm h-10 border-border" {...field} />
                              </FormControl>
                              <FormMessage className="text-xs text-error mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Detalhamento Final */}
                  <div className="p-4 rounded-sm border border-border bg-background flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-text-primary">Final billing Amount</span>
                      <p className="text-[10px] text-text-secondary mt-0.5">Includes taxes and promotions.</p>
                    </div>
                    <span className="text-lg font-bold text-[#E8A045]">R$ {finalPrice.toLocaleString('pt-BR')}</span>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-border">
                    <Button variant="ghost" disabled={isSubmitting} onClick={() => setCurrentStep(3)} className="h-10 text-xs flex items-center gap-2 cursor-pointer">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-10 text-xs px-6 bg-accent text-background hover:bg-accent-hover font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4" />
                          <span>Finalize Reservation</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* STEP 5: CONFIRMATION SUCCESS */}
        {currentStep === 5 && (
          <Card className="bg-surface border-border text-center py-10">
            <CardContent className="space-y-8 flex flex-col items-center">
              {/* Checkmark animado */}
              <div className="h-16 w-16 bg-success/15 rounded-full flex items-center justify-center text-success border border-success/30 animate-pulse">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div className="space-y-2 max-w-md">
                <CardTitle className="text-2xl font-heading font-semibold text-text-primary">Sanctuary Secured!</CardTitle>
                <CardDescription className="text-xs text-text-secondary leading-relaxed">
                  Your reservation transaction has been successfully confirmed. A digital check-in voucher and instructions have been synced with your account dashboard.
                </CardDescription>
              </div>

              {/* Detalhes Finais da Compra */}
              <div className="w-full max-w-sm p-5 border border-border rounded-sm bg-background/50 space-y-3 font-body text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Booking ID:</span>
                  <span className="font-bold text-text-primary uppercase">{confirmedBookingId.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Accommodation:</span>
                  <span className="font-bold text-text-primary">{room.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Dates:</span>
                  <span className="font-bold text-text-primary">{checkIn} to {checkOut}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-bold text-sm text-text-primary">
                  <span>Total Paid:</span>
                  <span className="text-[#E8A045]">R$ {finalPrice.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
                <Button variant="outline" asChild className="w-full h-11 text-xs cursor-pointer">
                  <Link to="/guest/booking-history">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View My Bookings
                  </Link>
                </Button>
                <Button asChild className="w-full h-11 text-xs cursor-pointer">
                  <Link to={ROUTES.HOME}>
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}