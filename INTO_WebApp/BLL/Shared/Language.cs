using System;
using System.Data.SqlClient;

namespace BLL.Shared
{
    public class Language : DataEntity<DataEntityCache<Language>, Language>
    {
        public Language() : base() { }
        public Language(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        public int Id { get; set; }
        public string Description { get; set; }
        public bool? RTL { get; set; }
        public string Code { get; set; }
        public override DataEntityCache<Language> Cache(DataEntityCache<Language> cache = null)
        {
            throw new NotImplementedException();
        }
        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
            this.Id = Convert.ToInt32(rdr["LanguageId"]);
            this.Description = rdr["Lang"] != DBNull.Value ? rdr["Lang"].ToString() : null;
            this.RTL = rdr["RTL"] != DBNull.Value ? Convert.ToBoolean(rdr["RTL"]) : default(bool?);
            this.Code = rdr["ISO_639_1Code"] != DBNull.Value ? rdr["ISO_639_1Code"].ToString() : null;
        }
    }
}
