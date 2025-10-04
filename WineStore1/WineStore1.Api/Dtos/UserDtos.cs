namespace WineStore1.Api.Dtos;

public record UserReadDto(
    long UserId,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string Role,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public record UserCreateDto(
    string FirstName,
    string LastName,
    string Email,
    string Password,        // prima raw, ti u servisu praviš hash
    string? PhoneNumber,
    string Role = "Customer");

public record UserUpdateDto(
    string FirstName,
    string LastName,
    string? PhoneNumber,
    string Role);
