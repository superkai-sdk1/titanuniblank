document.addEventListener('DOMContentLoaded', function () {
    function toggleDropdown() {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.classList.toggle('show');
    }

    document.addEventListener('click', function (event) {
        if (!event.target.matches('.dropdown-toggle')) {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (let dropdown of dropdowns) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
    });

    const burgerMenuButton = document.querySelector('.burger-menu-button');
    const menuModal = document.getElementById('menu-modal');

    if (burgerMenuButton) {
        console.log("Burger menu button found");
        burgerMenuButton.addEventListener('click', function () {
            console.log("Burger menu button clicked");
            menuModal.classList.toggle('show');
        });
    } else {
        console.log("Burger menu button not found");
    }

    menuModal.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            menuModal.classList.remove('show');
        }
    });
});