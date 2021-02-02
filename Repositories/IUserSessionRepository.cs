using GameTime.Models;

namespace GameTime.Repositories
{
    public interface IUserSessionRepository
    {
        void Add(UserSession userSession);
    }
}