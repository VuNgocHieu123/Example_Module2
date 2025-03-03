import { users as userCopy } from "../JAVASCRIPT/users.js";
import { posts } from "../JAVASCRIPT/posts.js";

// lấy dữ liệu từ localStorage nếu không có thì lấy dữ liệu từ users
let users = JSON.parse(localStorage.getItem('users')) || userCopy;

// cập nhật dữ liệu local để khi reload vẫn giữ được dữ liệu
if(!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(userCopy));
}

window.login = login;

function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // kiểm tra xem người dùng có nhập đầy đủ thông tin hay không
    if(!email || !password) {
        alert('Hãy nhập đủ thông tin')
        return;
    }

    // Tìm user password có trong mảng hay không
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            user = users[i];
            break;
        }
        console.log(user);
    }

    //kiểm tra kết quả tìm kiếm
    if(user) {
        alert("Xin chào" + " " + user.first_name + " " + user.last_name);
        setTimeout(() => {
            window.location.href = 'userList.html';
        }, 1000); 
    }else {
        alert("Thông tin sai");
    };

    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
};


// console.log('User', users);
// console.log('userList:', document.getElementById('userList'));

// Đăng ký
document.getElementById('register-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    var first_name = document.getElementById('firstName').value;
    var last_name = document.getElementById('lastName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;

    // Kiểm tra xem nhập đủ thông tin hay không
    if(!first_name || !last_name || !email || !password) {
        alert('Hãy nhập đủ thông tin'); 
        return;
    }

    // Kiểm tra xem email đã tồn tại hay chưa
    var emailExists = false;
    for(var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            emailExists = true;
            break;
        }
    }

    // Nếu email tồn tại
    if(emailExists) {
        alert('Email này đã tồn tại!');
        return;
    }

    var newUser = {
        id: users.length +1,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công!');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);

    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value  = '';
});


document.addEventListener('DOMContentLoaded', function () {
    renderUserList(users); // Load danh sách người dùng
});

document.getElementById('searchUsers')?.addEventListener('input', function () {
    const keyword = this.value.toLowerCase().trim();
    const filteredUsers = keyword
        ? users.filter(user =>
            user.first_name.toLowerCase().includes(keyword) ||
            user.last_name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword)
        )
        : users;
    renderUserList(filteredUsers);
});

function renderUserList(userData) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    userData.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.first_name} ${user.last_name}</td>
            <td>${user.email}</td>
        `;
        userList.appendChild(row);
    });
}



// XEM CHI TIẾT POST THEO ID
const searchPostForm = document.getElementById('searchPostById');
const searchInput = document.getElementById('postIdInput');
const postDetailContainer = document.getElementById('postDetail');
const paginationContainer = document.getElementById('pagination');

// Sự kiện tìm kiếm post theo ID
searchPostForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Ngăn load lại trang

    const postId = Number(searchInput.value.trim());
    if (!postId || isNaN(postId)) {
        postDetailContainer.innerHTML = '<p>Vui lòng nhập ID hợp lệ</p>';
        postDetailContainer.style.display = 'block';
        return;
    }

    // Tìm post theo ID
    const post = posts.find(p => p.id === postId);
    if (!post) {
        postDetailContainer.innerHTML = '<p>Không tìm thấy bài viết</p>';
        postDetailContainer.style.display = 'block';
        return;
    }

    // Tìm user theo user_id của post
    const user = users.find(user => user.id === post.user_id) || { first_name: 'Unknown', last_name: '' };

    // Render thông tin chi tiết của post
    postDetailContainer.innerHTML = `
        <h3>${post.title}</h3>
        <p><strong>ID:</strong> ${post.id}</p>
        <p><strong>Nội dung:</strong> ${post.content || 'Không có nội dung'}</p>
        <p><strong>Ngày tạo:</strong> ${post.created_at || 'N/A'}</p>
        <p><strong>Ngày sửa đổi:</strong> ${post.updated_at || 'N/A'}</p>
        <p><strong>Người tạo:</strong> ${user.first_name} ${user.last_name}</p>
        <p><strong>Hình ảnh:</strong></p>
        ${post.image 
            ? `<img src="${post.image}" alt="Hình ảnh bài viết" style="max-width: 300px; border-radius: 8px;">`
            : '<p>Không có hình ảnh</p>'
        }
    `;
    postDetailContainer.style.display = 'block';
});

// Ẩn chi tiết post và reset input khi click ra ngoài
document.addEventListener('click', function (event) {
    const isClickInsideForm = searchPostForm.contains(event.target);
    const isClickInsideDetail = postDetailContainer.contains(event.target);

    if (!isClickInsideForm && !isClickInsideDetail) {
        postDetailContainer.style.display = 'none';
        searchInput.value = ''; // Reset input về rỗng
    }
});

// Ngăn sự kiện click lan ra ngoài khi bấm vào trong chi tiết post
postDetailContainer.addEventListener('click', function (event) {
    event.stopPropagation();
});

// Phân trang
function displayPagination(totalPages, currentPage) {
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'pagination-button';
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => displayPosts(posts, i));
        paginationContainer.appendChild(button);
    }
}

// Hiển thị bài viết và phân trang
function displayPosts(postsList, currentPage = 1, postsPerPage = 10) {
    const postContainer = document.getElementById('postList');
    postContainer.innerHTML = '';

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const paginatedPosts = postsList.slice(start, end);

    paginatedPosts.forEach(post => {
        const row = document.createElement('tr');
        const user = users.find(user => user.id === post.user_id) || { first_name: 'Unknown', last_name: '' };

        row.innerHTML = `
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.created_at || 'N/A'}</td>
            <td>${user.first_name} ${user.last_name}</td>
        `;
        postContainer.appendChild(row);
    });

    const totalPages = Math.ceil(postsList.length / postsPerPage);
    displayPagination(totalPages, currentPage);
}

displayPosts(posts);

// TÌM KIẾM POST THEO EMAIL USER
document.getElementById('searchPosts')?.addEventListener('input', function (e) {
    const email = e.target.value.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === email);

    if (user) {
        const userPosts = posts.filter(p => p.user_id === user.id);
        displayPosts(userPosts);
    } else {
        document.getElementById('postList').textContent = 'Không tìm thấy bài viết nào của user này';
    }
});

document.getElementById('searchPosts')?.setAttribute('placeholder', 'Nhập email');
