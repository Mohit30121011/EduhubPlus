const SchoolProfile = require('../models/SchoolProfile');

// @desc    Get School Profile (Campus Info)
// @route   GET /api/settings/school
// @access  Private
const getSchoolProfile = async (req, res) => {
    try {
        // Find existing profile or return default
        let profile = await SchoolProfile.findOne();

        if (!profile) {
            // Return empty/default if not set yet (Frontend can handle defaults)
            return res.status(200).json({
                schoolName: '',
                tagline: '',
                email: '',
                website: '',
                address: '',
                logoUrl: ''
            });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching school profile' });
    }
};

// @desc    Update School Profile
// @route   PUT /api/settings/school
// @access  Private (Admin only usually, but open for now based on context)
const updateSchoolProfile = async (req, res) => {
    try {
        const { schoolName, tagline, email, website, address } = req.body;

        let profile = await SchoolProfile.findOne();

        if (profile) {
            // Update existing
            profile.schoolName = schoolName || profile.schoolName;
            profile.tagline = tagline || profile.tagline;
            profile.email = email || profile.email;
            profile.website = website || profile.website;
            profile.address = address || profile.address;

            await profile.save();
        } else {
            // Create new
            profile = await SchoolProfile.create({
                schoolName,
                tagline,
                email,
                website,
                address
            });
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error updating school profile' });
    }
};

module.exports = {
    getSchoolProfile,
    updateSchoolProfile
};
