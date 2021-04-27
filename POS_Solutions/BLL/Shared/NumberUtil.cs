namespace POS_Solutions.BLL.Shared
{
    public class NumberUtil
    {
        public static byte[] ToBytes(long value)
        {
            var bytes = new byte[]
            {
                (byte)(value >> 56),
                (byte)(0xFF & (value >> 48)),
                (byte)(0xFF & (value >> 40)),
                (byte)(0xFF & (value >> 32)),
                (byte)(0xFF & (value >> 24)),
                (byte)(0xFF & (value >> 16)),
                (byte)(0xFF & (value >> 8)),
                (byte)(0xFF & value)
            };
            return bytes;
        }

        public static long? ToLong(byte[] data)
        {
            if (data == null || data.Length < 8)
            {
                return 0;
            }

            return (long)data[0] << 56 | (long)data[1] << 48 | (long)data[2] << 40 | (long)data[3] << 32 | (long)data[4] << 24 | (long)data[5] << 16 | (long)data[6] << 8 | (long)data[7];
        }
    }
}
