using System.Collections.Generic;

namespace BLL.Shared
{
    public class Subject
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public IList<Material> materials = new List<Material>();
    }
}
