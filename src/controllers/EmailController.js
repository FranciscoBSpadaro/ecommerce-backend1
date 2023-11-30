const User = require('../models/User');
const UserDetails = require('../models/UserDetails');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { hashPassword } = require('../utils/passwordUtils');
const generateVerificationCode = require('../utils/verificationCode');

const sesClient = new SESClient({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const sendWelcomeEmail = (email, verificationCode) => {
  const link = `${process.env.APP_URL}/profile`;
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Welcome to our online store.\nDon't forget to validate your email.\nYour verification code is: ${verificationCode}\nUse this code in the Profile menu: ${link}`,
        },
      },
      Subject: {
        Data: 'Successful Registration in the Online Store',
      },
    },
    Source: process.env.EMAIL_SENDER,
  };

  const command = new SendEmailCommand(params);
  return sesClient.send(command);
};

const sendVerificationEmail = (email, verificationCode) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Your verification code is: ${verificationCode}`,
        },
      },
      Subject: {
        Data: 'Verification Code',
      },
    },
    Source: process.env.EMAIL_SENDER,
  };

  const command = new SendEmailCommand(params);
  return sesClient.send(command);
};

const sendNewPassword = (email, newpassword) => {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Data: `Your new password is:\n${newpassword}\nChange your password after logging in`,
        },
      },
      Subject: {
        Data: 'Temporary New Password',
      },
    },
    Source: process.env.EMAIL_SENDER,
  };

  const command = new SendEmailCommand(params);
  return sesClient.send(command);
};

// Request verification code for user email
const requestVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Email not found. Invalid Email' });
    }

    // verification Code Length 10
    const verificationCode = generateVerificationCode(10);
    await sendVerificationEmail(email, verificationCode);

    // Set isCodeValid to true
    await UserDetails.update(
      { verificationCode, isCodeValid: true },
      { where: { userId: user.id } },
    );

    return res
      .status(200)
      .json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        message: 'Email verification request unsuccessful. An error occurred.',
      });
  }
};

// Requests a new password and sends it to the user email
const requestNewPassword = async (req, res) => {
  try {
    const { id } = req.body;
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Password length 16
    const newPassword = generateVerificationCode(16);
    const hashedPassword = await hashPassword(newPassword);
    await User.update({ password: hashedPassword }, { where: { id } });
    await sendNewPassword(user.email, newPassword);

    return res
      .status(200)
      .json({ message: 'New password email sent successfully!' });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Failed to request a new password.' });
  }
};

// Verifies the user email using a verification code
const verifyEmail = async (req, res) => {
  try {
    const { verificationCode, email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Email doesn t exist' });
    }

    if (verificationCode === user.verificationCode) {
      await User.update({ isEmailValidated: true }, { where: { email } });
      return res.status(200).json({ message: 'Email verified successfully!' });
    } else {
      return res
        .status(403)
        .json({
          message: 'Invalid verification code. Please check and try again.',
        });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Updates the user email
const updateUserEmail = async (req, res) => {
  try {
    const { username } = req.decodedToken;
    const { email } = req.body;
    const emailExists = await User.findOne({ where: { email } });

    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const isEmailValidated = emailExists.isEmailValidated;
    const verificationCode = generateVerificationCode(8);

    // Check if the username exists
    const [updatedRows] = await User.update({ email }, { where: { username } });

    if (updatedRows > 0) {
      console.log(`User ${username}'s email has been updated to ${email}`);

      if (isEmailValidated) {
        await User.update({ isEmailValidated: false }, { where: { username } });
        console.log('isEmailValidated status reverted to false.');
      }

      await sendVerificationEmail(email, verificationCode);
      await User.update({ verificationCode }, { where: { email } });

      res.status(200).json({
        message:
          'Email updated successfully. New verification code has been sent.',
      });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid or already registered email' });
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendNewPassword,
  requestVerification,
  requestNewPassword,
  verifyEmail,
  updateUserEmail,
};
