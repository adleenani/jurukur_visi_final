<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Access Denied | Jurukur Visi</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: sans-serif;
            background: #f9fafb;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }

        .container {
            text-align: center;
            padding: 2rem;
        }

        .code {
            font-size: 6rem;
            font-weight: 700;
            color: #dc2626;
            line-height: 1;
        }

        .title {
            font-size: 1.5rem;
            color: #1f2937;
            margin: 1rem 0 0.5rem;
        }

        .desc {
            color: #6b7280;
            font-size: 0.95rem;
            margin-bottom: 2rem;
        }

        .btn {
            display: inline-block;
            background: #15803d;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.9rem;
        }

        .btn:hover {
            background: #166534;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="code">403</div>
        <h1 class="title">Access denied</h1>
        <p class="desc">You don't have permission to access this page. Please log in with the correct account.</p>
        <a href="/login" class="btn">Go to login</a>
    </div>
</body>

</html>