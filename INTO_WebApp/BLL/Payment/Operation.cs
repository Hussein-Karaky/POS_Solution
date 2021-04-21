using System;
using System.Data.SqlClient;

namespace BLL.Payment
{
    public class Operation
    {
        public long Id { set; get; }
        public DateTime DateStamp { get; set; }
        public long UID { set; get; }
        public int ObjEntityId { set; get; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public int ServiceId { get; set; }
        public string Description { get; set; }
        public string RespId { get; set; }
        public string ApiReference { get; set; }
        public string RespType { get; set; }  
        public string RespDetails { get; set; }
        public DateTime RespDate { get; set; }
        public string RespAttch { get; set; }
        public int BillingInfoId { get; set; }
        public int Auto { get; set; }
        public long RelationId { get; set; }
        public long TutorId { get; set; }
        public string TutorName { get; set; }
        public string RelationEntity { get; set; }
        public int SerialId{ get; set; }
        public string SerialNb { get; set; }
        public string PaymentMethod { get; set; }
        public int PaymentMethodId { get; set; }
        public string OprType { get; set; }
        public int OprTypeId { get; set; }
        public DateTime CaptureOn { get; set; }
        public int Captured { get; set; }
        public bool CanRefund { get; set; }
        public bool CanVoid { get; set; }
        public string Action { get; set; }
        public DateTime CancelationDate { get; set; }
        public BillingInfo billingInfo { get; set; }
        public int Canceled { get; set; }
        public long LinkedOprId { get; set; }
    }
}