using GameTime.Data;
using GameTime.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Repositories
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendRepository : ControllerBase, IFriendRepository
    {
        private readonly ApplicationDbContext _context;

        public FriendRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //get all the friends of a given userId
        public List<User> Get(int userId)
        {
            return _context.Friend
                .Include(f => f.Other)
                .Where(f => f.UserId == userId && f.IsConfirmed && f.Other.IsActive)
                .Select(f => f.Other)
                .ToList();
        }
    }
}
