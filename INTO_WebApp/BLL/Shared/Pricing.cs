using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared
{
    public class Pricing
    {
        public decimal Amount { get; set; }
        public Currency Currency { get; set; }
        public PaymentMethod Methods { get; set; } = PaymentMethod.Cash | PaymentMethod.Card | PaymentMethod.WireTransfer;

        public enum PaymentMethod
        {
            Cash = 0,
            Card = 1,
            WireTransfer = 2,
            PayPal = 3
        }
    }
}
