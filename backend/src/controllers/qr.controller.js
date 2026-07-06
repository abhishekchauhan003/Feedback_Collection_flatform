const Branch = require('../models/Branch');
const Business = require('../models/Business');
const QRCode = require('qrcode');
const { frontendUrl } = require('../config/env');

exports.createBranch = async (req, res, next) => {
  try {
    const { businessId, branchName, address } = req.body;
    const business = await Business.findOne({ _id: businessId, ownerId: req.user.id });
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const branch = new Branch({ businessId, branchName, address });
    await branch.save();

    const qrData = `${frontendUrl}/feedback/${businessId}/${branch._id}`;
    const qrImage = await QRCode.toDataURL(qrData);

    branch.qrCodeData = qrData;
    branch.qrCodeImage = qrImage;
    await branch.save();

    res.status(201).json(branch);
  } catch (err) {
    next(err);
  }
};

exports.getBranches = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const branches = await Branch.find({ businessId });
    res.json(branches);
  } catch (err) {
    next(err);
  }
};

exports.getBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });
    res.json(branch);
  } catch (err) {
    next(err);
  }
};