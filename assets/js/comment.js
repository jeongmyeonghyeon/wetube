import axios from 'axios';

const addCommentForm = document.getElementById('jsAddComment');
const removeCommentButton = document.getElementsByClassName('removeCommentButton')

const sendComment = async (comment) => {
    const videoId = window.location.href.split('/videos/')[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
        }
    }).then((response) => {
        console.log("1: ", response);
    });
    console.log("2: ", response);
}

const removeComment = async (id) => {
    await axios({
        method: 'POST',
        url: `/api/${id}/remove-comment`,
    }).then(response => {
        console.log(response);
    });
}

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector('input');
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
}

const handleRemove = function (event) {
    removeComment(this.dataset.id);
}

function init () {
    addCommentForm.addEventListener('submit', handleSubmit);
    for (let i = 0; i < removeCommentButton.length; i++) {
        removeCommentButton[i].addEventListener('click', handleRemove);
    }
}

if ( addCommentForm ) {
    init();
}