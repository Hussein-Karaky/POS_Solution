using System;

namespace BLL.Payment
{
    public class Balance
    {
        public long TotalBalance{ set; get; }
        public long Revenue{ set; get; }
        public long Fees{ set; get; }
        public long Pending{ set; get; }
    }
}