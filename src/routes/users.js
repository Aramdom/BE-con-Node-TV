import { Router } from 'express';

const router = Router();

// Memory-based user storage seed
let users = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada.lovelace@example.com',
    role: 'Engineer',
    createdAt: new Date('2026-05-26T10:00:00.000Z').toISOString()
  },
  {
    id: 2,
    name: 'Alan Turing',
    email: 'alan.turing@example.com',
    role: 'Researcher',
    createdAt: new Date('2026-05-26T11:30:00.000Z').toISOString()
  }
];

let nextId = 3;

// Helper to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * GET /api/users
 * Returns list of all users.
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * GET /api/users/:id
 * Returns a specific user by ID.
 */
router.get('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `User with ID ${userId} does not exist.`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users
 * Creates a new user.
 */
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  // Validation
  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Name is a required field.'
    });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Email is a required field.'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Please provide a valid email address.'
    });
  }

  // Check if email already exists to be neat
  const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    return res.status(400).json({
      success: false,
      error: 'Conflict',
      message: `User with email ${email} already exists.`
    });
  }

  // Create new user
  const newUser = {
    id: nextId++,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role ? role.trim() : 'User',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully.',
    data: newUser
  });
});

/**
 * PUT /api/users/:id
 * Updates an existing user details (name, email, role).
 */
router.put('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `User with ID ${userId} does not exist.`
    });
  }

  const { name, email, role } = req.body;
  const currentUser = users[userIndex];

  // If email is being updated, validate it and check if it conflicts with another user
  if (email && email.trim() !== currentUser.email) {
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Please provide a valid email address.'
      });
    }

    const emailExists = users.some(u => u.id !== userId && u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: 'Conflict',
        message: `User with email ${email} already exists.`
      });
    }
  }

  // Construct updated fields
  const updatedUser = {
    ...currentUser,
    name: name !== undefined ? name.trim() : currentUser.name,
    email: email !== undefined ? email.trim().toLowerCase() : currentUser.email,
    role: role !== undefined ? role.trim() : currentUser.role,
    updatedAt: new Date().toISOString()
  };

  // Perform simple validation on updated name
  if (updatedUser.name === '') {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Name cannot be empty.'
    });
  }

  users[userIndex] = updatedUser;

  res.status(200).json({
    success: true,
    message: 'User updated successfully.',
    data: updatedUser
  });
});

/**
 * DELETE /api/users/:id
 * Deletes a user by ID.
 */
router.delete('/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `User with ID ${userId} does not exist.`
    });
  }

  const deletedUser = users[userIndex];
  users.splice(userIndex, 1);

  res.status(200).json({
    success: true,
    message: `User with ID ${userId} was successfully deleted.`,
    data: deletedUser
  });
});

export default router;
