namespace BLL.Shared
{
    public abstract class DataEntityCache<T>    {
        public abstract T Extract(T obj);
    }
}