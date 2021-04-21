using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared
{
   public class RegistrationSteps
    {
        public int ObjId { get; set; }
        public int ObjEntityId { get; set; }
        public int RegistrationStepId { get; set; }
        public int StepId { get; set; }
        public string StepDescription { get; set; }
        public int Completed { get; set; }
    }
}
