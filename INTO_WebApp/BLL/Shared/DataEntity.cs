using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace BLL.Shared
{
    public abstract class DataEntity<T, E> where T : DataEntityCache<E>
    {
        public DataEntity() { }
        public DataEntity(SqlDataReader reader, string prefix = null) {
            this.Set(reader, prefix);
        }
        public virtual void Set(SqlDataReader rdr, string prefix = null) { }
        public virtual JObject ToJson()
        {
            return JObject.FromObject(this);
        }

        public abstract T Cache(T cache = null);

        public virtual bool IsValid()
        {
            return true;
        }
    }
}
