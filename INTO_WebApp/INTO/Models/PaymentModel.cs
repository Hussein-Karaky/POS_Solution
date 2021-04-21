using BLL.Payment;
using BLL.Shared;
using System;
using System.Collections.Generic;

namespace INTO.Models
{
    public class PaymentModel : LoginModel
    {
        public BillingInfo billingInfo { get; set; }
        public Boolean hasHasBlInfo { get; set; }
        public Session session { get; set; }
        public Operation operation { get; set; }
        public int OprId { get; set; }
        public int SessionId { get; set; }
        public IList<OperationView> Operations { get; set; }
        public IList<Session> PaidSessions { get; set; }
        public decimal wallet { get; set; }
        public string Action { get; set; }
    }
}