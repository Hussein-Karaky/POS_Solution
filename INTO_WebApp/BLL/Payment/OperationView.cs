using System;
namespace BLL.Payment
{
    public class OperationView
    {
        public long Id { set; get; }
        public string DateString { get; set; }
        public string CapDateString { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string Description { get; set; }
        public string TutorName { get; set; }
        public string Agent { get; set; }
        public string PaymentMethod { get; set; }
        public long RelationId { get; set; }
        public int OprTypeId { get; set; }
        public int Captured { get; set; }
    }
}