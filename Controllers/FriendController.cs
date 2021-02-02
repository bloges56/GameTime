using GameTime.Models;
using GameTime.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GameTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FriendController : ControllerBase
    {
        private readonly IFriendRepository _friendRepo;
        private readonly IUserRepository _userRepo;
        public FriendController(IFriendRepository friendRepo, IUserRepository userRepo)
        {
            _userRepo = userRepo;
            _friendRepo = friendRepo;
        }

        // endpoint for getting all the friends of a user
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // check that the user exists
            var user = _userRepo.GetById(id);
            if(user == null)
            {
                return BadRequest();
            }

            // check that the current user is equal to the passed user
            var currentUser = GetCurrentUserProfile();
            if(user != currentUser)
            {
                return Unauthorized();
            }

            // return all the friends of the given user
            var friends = _friendRepo.Get(id);
            return Ok(friends);
        }

        private User GetCurrentUserProfile()
        {
            try
            {
                var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return _userRepo.GetByFirebaseUserId(firebaseUserId);
            }
            catch
            {
                return null;
            }
        }
    }
}
