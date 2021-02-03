using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface IUserSessionRepository
    {
        void Add(UserSession userSession);
        List<User> Get(int userId, int sessionId);
    }
}