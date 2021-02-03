using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface IUserSessionRepository
    {
        void Add(UserSession userSession);
        void Delete(UserSession userSession);
        bool Exists(int userId, int sessionId);
        List<User> Get(int userId, int sessionId);
        UserSession GetByContent(int userId, int sessionId);
        UserSession GetById(int id);
    }
}