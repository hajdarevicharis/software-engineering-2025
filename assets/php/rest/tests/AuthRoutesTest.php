<?php

use PHPUnit\Framework\TestCase;
use Firebase\JWT\JWT;

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/config.php';

class AuthRoutesTest extends TestCase
{
    protected function setUp(): void
    {
        Flight::set('auth_service', new class {
            public function get_user_by_email($email) {
                if ($email === "test@example.com") {
                    return [
                        "id" => 1,
                        "email" => "test@example.com",
                        "pwd" => password_hash("secret123", PASSWORD_BCRYPT),
                        "name" => "Test User"
                    ];
                }
                return null;
            }
        });
    }

    public function testLoginSuccess()
    {
        $_POST = [
            "email" => "test@example.com",
            "pwd" => "secret123"
        ];

        Flight::request()->data->email = $_POST["email"];
        Flight::request()->data->pwd = $_POST["pwd"];

        ob_start();
        include __DIR__ . '/../routes/auth_routes.php';
        Flight::router()->handle('POST', '/login');
        $output = ob_get_clean();

        $response = json_decode($output, true);

        $this->assertArrayHasKey("token", $response);
        $this->assertEquals("test@example.com", $response["email"]);
    }

    public function testLoginUserNotFound()
    {
        $_POST = [
            "email" => "noone@nowhere.com",
            "pwd" => "anything"
        ];

        Flight::request()->data->email = $_POST["email"];
        Flight::request()->data->pwd = $_POST["pwd"];

        $this->expectOutputRegex('/user not found/i');
        include __DIR__ . '/../routes/auth_routes.php';
        Flight::router()->handle('POST', '/login');
    }

    public function testLoginWrongPassword()
    {
        $_POST = [
            "email" => "test@example.com",
            "pwd" => "wrongpassword"
        ];

        Flight::request()->data->email = $_POST["email"];
        Flight::request()->data->pwd = $_POST["pwd"];

        $this->expectOutputRegex('/Invalid email or password/i');
        include __DIR__ . '/../routes/auth_routes.php';
        Flight::router()->handle('POST', '/login');
    }
}
