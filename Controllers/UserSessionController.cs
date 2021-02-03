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
    public class UserSessionController : ControllerBase
    {
        private readonly ISessionRepository _sessionRepo;
        private readonly IUserRepository _userRepo;
        private readonly IUserSessionRepository _userSessionRepo;
        private readonly IFriendRepository _friendRepo;
        public UserSessionController(ISessionRepository sessionRepo, IUserRepository userRepo, IUserSessionRepository userSessionRepo, IFriendRepository friendRepo)
        {
            _sessionRepo = sessionRepo;
            _userRepo = userRepo;
            _userSessionRepo = userSessionRepo;
            _friendRepo = friendRepo;
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            // check that the session exists
            var session = _sessionRepo.GetById(id);
            if(session == null)
            {
                return BadRequest();
            }
            var currentUser = GetCurrentUserProfile();

            var users = _userSessionRepo.Get(currentUser.Id, session.Id);
            return Ok(users);
        }

        // endpoint to post a user session
        [HttpPost]
        public IActionResult Add(UserSession userSession)
        {
            //make sure both the passed user and session exist
            var user = _userRepo.GetById(userSession.UserId);
            var session = _sessionRepo.GetById(userSession.SessionId);

            if(user == null || session == null)
            {
                return BadRequest();
            }


            
            //if the currentUser is not the session owner, return unauthorized
            var currentUser = GetCurrentUserProfile();
            if(currentUser.Id != session.OwnerId)
            {
                return Unauthorized();
            }


            // check if the user creating the userSession is also the user in the user session
            if (user == currentUser)
            {
                return BadRequest();
            }
            //check that user is a friend of the currentuser/owner
            if (!_friendRepo.Get(currentUser.Id).Contains(user))
            {
                return Unauthorized();
            }

            userSession.IsConfirmed = false;
            //add the userSessoin to the database
            _userSessionRepo.Add(userSession);
            return Ok(userSession);
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
