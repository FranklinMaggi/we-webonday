interface Props {
    state: {
      orderId?: string;
    };
  }
  
  export default function PaymentPaypal({ state }: Props) {
    if (!state.orderId) {
      return <p>Ordine non pronto</p>;
    }
  
    return (
      <section>
        <h2>Pagamento</h2>
        <p>Order ID: {state.orderId}</p>
  
        {/* qui monterai PayPal Buttons */}
        <div id="paypal-buttons" />
      </section>
    );
  }
  