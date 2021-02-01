using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface ISessionRepository
    {
        List<Session> GetAll();
        List<Session> GetAllConfirmed(int userId);
    }
}