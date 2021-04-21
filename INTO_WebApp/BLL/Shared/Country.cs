using INTO.BLL.Attributes;
using System;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;

namespace BLL.Shared
{
    public class Country:DataEntity<DataEntityCache<Country>, Country>
    {
        public Country() : base() { }
        public Country(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }

        public int Id { set; get; }
        public string Code { set; get; }
        [Translatable]
        [MaxLength(100)]
        public string Name { set; get; }
        public Location Location { get; set; }
        public string ISOCode { set; get; }
        public string Alpha3Code { set; get; }
        public string Alpha2Code { set; get; }
        public Currency Currency { get; set; }
        public override DataEntityCache<Country> Cache(DataEntityCache<Country> cache = null)
        {
            throw new NotImplementedException();
        }

        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr);
            this.Id = Convert.ToInt32(rdr["CountryId"]);
            this.Code = rdr["CountryCode"] != DBNull.Value ? rdr["CountryCode"].ToString() : "";
            this.Name = rdr["CountryName"] != DBNull.Value ? rdr["CountryName"].ToString() : "";
            this.Location = new Location(rdr, nameof(Country));
            this.ISOCode = rdr["ISOCode"] != DBNull.Value ? rdr["ISOCode"].ToString() : "";
            this.Alpha3Code = rdr["Alpha3Code"] != DBNull.Value ? rdr["Alpha3Code"].ToString() : "";
            this.Alpha2Code = rdr["Alpha2Code"] != DBNull.Value ? rdr["Alpha2Code"].ToString() : "";
        }
    }
}