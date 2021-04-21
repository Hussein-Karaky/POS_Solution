namespace BLL.Shared
{
    public class RegistrationStep
    {
        public int Id { get; set; }
        public long UId { get; set; }
        public string UIName { get; set; }
        public byte ObjEntityId { get; set; }
        public long? RegistrationStepId { get; set; }
        public int? ContentId { get; set; }
        public string StepDescription { get; set; }
        public bool Completed { get; set; }
        public bool Visited { get; set; }
    }
}
