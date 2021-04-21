namespace BLL.Shared
{
    public class Step
    {
        public int Id { get; set; }
        public long UId { get; set; }
        public long RegistrationStepId { get; set; }
        public char StepStatus { get; set; }
        public byte ObjEntityId { get; set; }
    }
}
