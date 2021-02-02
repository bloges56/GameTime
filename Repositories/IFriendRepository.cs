using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface IFriendRepository
    {
        List<User> Get(int userId);
    }
}