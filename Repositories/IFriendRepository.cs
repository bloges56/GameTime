using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface IFriendRepository
    {
        void Add(Friend friend);
        bool Exists(Friend friend);
        List<User> Get(int userId);
    }
}