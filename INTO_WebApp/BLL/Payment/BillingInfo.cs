using System;

namespace BLL.Payment
{
    public class BillingInfo
    {
        public long UID { set; get; }
        public int ObjEntityId { set; get; }
        public DateTime DateStamp { get; set; }
        public string CardId { get; set; }
        public int CardLast4dig { get; set; }
        public string CardType { get; set; }
        public string CardExpYear { get; set; }
        public string CardExpMnth { get; set; }
    }
}