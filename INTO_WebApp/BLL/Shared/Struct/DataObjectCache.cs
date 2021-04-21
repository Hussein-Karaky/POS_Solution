using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Struct
{
    public class DataObjectCache : DataEntityCache<DataObject>
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public byte Type { get; set; }
        public override DataObject Extract(DataObject obj)
        {
            if (obj == null)
            {
                obj = new DataObject();
            }
            obj.Id = this.Id;
            obj.Name = this.Name;
            obj.ByteType = this.Type;
            return obj;
        }
    }
}
