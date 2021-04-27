using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace POS_Solutions.BLL.Shared
{
    public class LocationSettings : DataEntity<DataEntityCache<LocationSettings>, LocationSettings>
    {
        public LocationSettings() : base() { }
        public LocationSettings(SqlDataReader reader, string prefix = null) : base(reader, prefix){}

        public Country Country { get; set; }
        public string City { get; set; }
        public short? TimezoneOffset { get; set; }
        public string Address { get; set; }
        public string SecondAddress { get; set; }
        public Location Location { get; set; }
        public decimal? PrivacyRadius { get; set; }
        public decimal? TravelRadius { get; set; }
        public override DataEntityCache<LocationSettings> Cache(DataEntityCache<LocationSettings> cache = null)
        {
            throw new NotImplementedException();
        }

        public override void Set(SqlDataReader reader, string prefix = null)
        {
            base.Set(reader);
            this.Country = new Country(reader);
            this.City = reader["City"] != DBNull.Value ? reader["City"].ToString() : "";
            this.TimezoneOffset = reader["TimezoneOffset"] != DBNull.Value ? Convert.ToInt16(reader["TimezoneOffset"]) : default(short?);
            this.Address = reader["Address"] != DBNull.Value ? reader["Address"].ToString() : "";
            this.SecondAddress = reader["Address2"] != DBNull.Value ? reader["Address2"].ToString() : "";
            this.Location = new Location(reader);
            this.PrivacyRadius = reader["PrivacyRadius"] != DBNull.Value ? Convert.ToDecimal(reader["PrivacyRadius"]) : default(decimal?);
            this.TravelRadius = reader["TravelRadius"] != DBNull.Value ? Convert.ToDecimal(reader["TravelRadius"]) : default(decimal?);
        }
    }
}
