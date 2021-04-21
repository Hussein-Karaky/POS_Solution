using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace BLL.Tutor
{
    public class TutorRate : DataEntity<DataEntityCache<TutorRate>, TutorRate>
    {
        public TutorRate() : base() { }
        public TutorRate(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        public long Id { get; set; }
        public long TutorId { get; set; }
        public int MaterialId { get; set; }
        public long LessonType { get; set; }
        public decimal Price { get; set; }
        public int Currency { get; set; }

        public override DataEntityCache<TutorRate> Cache(DataEntityCache<TutorRate> cache = null)
        {
            throw new NotImplementedException();
        }

        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
            this.Id = Convert.ToInt64(rdr["Id"]);
            this.TutorId = Convert.ToInt64(rdr["TutorId"]);
            this.MaterialId = Convert.ToInt32(rdr["MaterialSysId"]);
            this.LessonType = Convert.ToInt32(rdr["LessonType"]);
            this.Price = Convert.ToDecimal(rdr["Price"]);
            this.Currency = Convert.ToInt32(rdr["Cur"]);
        }
    }
}
