using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Steps
{
    public class Step
    {
        public int Id { get; set; }
        public long UID { get; set; }
        public int RegistrationStepId { get; set; }
        public char StepStatus { get; set; }
        public long ObjEntityId { get; set; }

    }
}
