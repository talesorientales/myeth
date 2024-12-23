// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ContentMarketplace {
    string public greeting = "Initial greeting!";
    address public owner;

    struct Content {
        uint256 price; // Цена контента в wei
        string uri; // Ссылка на контент
    }

    // Список контентов
    Content[] public contents;

    // Хранение информации о доступах к контентам
    mapping(address => mapping(uint256 => bool)) public hasAccess;

    // События
    event ContentAdded(uint256 indexed contentId, uint256 price, string uri);
    event ContentPurchased(address indexed buyer, uint256 indexed contentId);
    event PriceUpdated(uint256 indexed contentId, uint256 newPrice);
    event ContentUpdated(uint256 indexed contentId, string newUri);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Добавить новый контент (только владелец)
    function addContent(uint256 _price, string memory _uri) external onlyOwner {
        contents.push(Content({price: _price, uri: _uri}));
        emit ContentAdded(contents.length - 1, _price, _uri);
    }

    // Обновить цену для контента (только владелец)
    function updatePrice(uint256 _contentId, uint256 _newPrice) external onlyOwner {
        require(_contentId < contents.length, "Invalid content ID");
        contents[_contentId].price = _newPrice;
        emit PriceUpdated(_contentId, _newPrice);
    }

    // Обновить ссылку на контент (только владелец)
    function updateContentURI(uint256 _contentId, string memory _newUri) external onlyOwner {
        require(_contentId < contents.length, "Invalid content ID");
        contents[_contentId].uri = _newUri;
        emit ContentUpdated(_contentId, _newUri);
    }

    // Покупка доступа к контенту
    function buyContent(uint256 _contentId) external payable {
        require(_contentId < contents.length, "Invalid content ID");
        require(msg.value == contents[_contentId].price, "Incorrect payment amount");
        require(!hasAccess[msg.sender][_contentId], "Access already granted");

        hasAccess[msg.sender][_contentId] = true;
        emit ContentPurchased(msg.sender, _contentId);
    }

    // Получить ссылку на купленный контент
    function getContent(uint256 _contentId) external view returns (string memory) {
        require(_contentId < contents.length, "Invalid content ID");
        require(hasAccess[msg.sender][_contentId], "Access denied");
        return contents[_contentId].uri;
    }

    // Проверка доступа к контенту
    function checkAccess(uint256 _contentId) external view returns (bool) {
        require(_contentId < contents.length, "Invalid content ID");
        return hasAccess[msg.sender][_contentId];
    }

    // Получить цену к контенту
    function getPrice(uint256 _contentId) external view returns (uint256) {
        require(_contentId < contents.length, "Invalid content ID");
        return contents[_contentId].price;
    }

    // Вывод всех средств владельцем
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    // Проверка состояния контракта
    function contractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    // Получить количество доступных контентов
    function getContentCount() external view returns (uint256) {
        return contents.length;
    }
}
