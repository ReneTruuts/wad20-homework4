const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])
    })
});

router.post('/', authorize,  (request, response) => {

    let text = request.body.text;
    let media_type = request.body.media_type;
    let media_url = request.body.media_url;

    let form = {
        id: {required: true},
        text: {required: true},
        createTime: {required: false},
        likes: {required: false},
        liked: {required: false},
        media: {
            media_url: {required: false},
            media_type: {required: false},
        },
        author: {
            firstname: {required: true},
            lastname: {required: false},
            avatar: {required: false},
        }
    };

    const fieldMissing = {
        code: null,
        message: 'Please provide %s'
    };

    for (let field in form) {
        if (form[field].required === true && !request.body[field]) {

            fieldMissing.code = field;
            fieldMissing.message = fieldMissing.message.replace('%s', field);

            response.json(fieldMissing, 400);
            return;
        }
    }

        if (!text) {
            response.json({ message: "Please provide post text"}, 400)
        }

    if (media_url && typeof media_type != 'object') {
            response.json ({message: "Please provide properly formatted media"}, 400)
        }

    let params = {
        id: request.body.id,
        text: request.body.textContent,
        createTime: request.body.createTime,
        likes: request.body.likes,
        liked: request.body.liked,
        media: {
            media_url: request.body.media_url,
            media_type: request.body.media_type,
        },
        author: {
            id: request.currentUser.id,
            firstname: request.currentUser.firstname,
            lastname: request.currentUser.lastname,
            avatar: request.currentUser.avatar
        },
    };

    PostModel.create(params, () => {
        response.status(201).json()
    });
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post

});

module.exports = router;
