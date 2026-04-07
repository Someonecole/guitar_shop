export default function Stripe() {
  return {
    checkout: {
      sessions: {
        create: async () => ({ id: "sess_test", url: "http://example.com/checkout" })
      }
    }
  };
}