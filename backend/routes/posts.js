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

    let form = {
        userId: {required: true},
        text: {required: true},
        createTime: {required: true},
        likes: {required: false},
        liked: {required: false},
        media: {
            url: {required: false},
            type: {required: false},
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

    if (url && typeof type != 'object') {
            response.json ({message: "Please provide properly formatted media"}, 400)
        }

    let params = {
        userId: request.currentUser.id,
        text: request.body.text,
        createTime: request.body.createTime,
        media: {
            type: request.body.media.type,
            url: request.body.media.url
        },
    }

    PostModel.create(params, () => {
        response.status(201).json()
    });
});


router.put('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to like a post

    PostModel.like(request.currentUser.id, request.params.postId, () => {
        response.status(200).json()
    })
});

router.delete('/:postId/likes', authorize, (request, response) => {

    // Endpoint for current user to unlike a post

});

module.exports = router;
