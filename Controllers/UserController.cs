using GameTime.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repo;
        public UserController(IUserRepository repo)
        {
            _repo = repo;
        }


        [HttpGet("{firebaseUserId}")]
        public IActionResult GetUserProfile(string firebaseUserId)
        {
            var user = _repo.GetByFirebaseUserId(firebaseUserId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.IsActive == false)
            {
                return Unauthorized();
            }

            return Ok(user);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _repo.GetAll();
           
            return Ok(users);
        }
    }
}
