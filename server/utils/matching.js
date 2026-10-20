const calculateSkillMatch = (studentSkills, requiredSkills) => {
  if (!studentSkills || !requiredSkills || requiredSkills.length === 0) {
    return 0;
  }

  const studentSkillSet = studentSkills.map((skill) =>
    skill.toLowerCase().trim()
  );

  let matchedSkills = 0;

  requiredSkills.forEach((skill) => {
    const normalizedSkill = skill.toLowerCase().trim();

    if (studentSkillSet.includes(normalizedSkill)) {
      matchedSkills++;
    }
  });

  return Math.round(
    (matchedSkills / requiredSkills.length) * 100
  );
};


const calculateExperienceMatch = (experience, jobTitle) => {
  if (!experience || experience.length === 0 || !jobTitle) {
    return 0;
  }

  const normalizedJobTitle = jobTitle.toLowerCase().trim();

  const hasRelevantExperience = experience.some((exp) => {
    if (!exp.role) {
      return false;
    }

    const role = exp.role.toLowerCase().trim();

    return (
      normalizedJobTitle.includes(role) ||
      role.includes(normalizedJobTitle)
    );
  });

  return hasRelevantExperience ? 100 : 0;
};

const calculateEducationMatch = (education, jobTitle) => {
  if (!education || education.length === 0 || !jobTitle) {
    return 0;
  }

  const technicalFields = [
    "computer science",
    "information technology",
    "software engineering",
    "computer engineering"
  ];

  const normalizedJobTitle = jobTitle.toLowerCase().trim();

  const isTechnicalJob =
    normalizedJobTitle.includes("developer") ||
    normalizedJobTitle.includes("software") ||
    normalizedJobTitle.includes("engineer") ||
    normalizedJobTitle.includes("programmer") ||
    normalizedJobTitle.includes("web") ||
    normalizedJobTitle.includes("backend") ||
    normalizedJobTitle.includes("frontend") ||
    normalizedJobTitle.includes("full stack");

  if (!isTechnicalJob) {
    return 0;
  }

  const hasRelevantEducation = education.some((edu) => {
    if (!edu.field) {
      return false;
    }

    const field = edu.field.toLowerCase().trim();

    return technicalFields.some((technicalField) =>
      field.includes(technicalField)
    );
  });

  return hasRelevantEducation ? 100 : 0;
};

const calculateLocationMatch = (studentLocation,studentWorkMode,jobLocation,jobWorkMode) => {
  if (!studentWorkMode || !jobWorkMode) {
    return 0;
  }

  if (studentWorkMode === "Remote" && jobWorkMode === "Remote") {
    return 100;
  }

  if (
    studentLocation &&
    jobLocation &&
    studentLocation.toLowerCase().trim() ===
      jobLocation.toLowerCase().trim()
  ) {
    return 100;
  }

  if (studentWorkMode === jobWorkMode) {
    return 50;
  }

  return 0;
};

const matchStudentWithJob = (studentProfile, job) => {
  const skillScore = calculateSkillMatch(
    studentProfile.skills,
    job.skillsRequired
  );

  const experienceScore = calculateExperienceMatch(
    studentProfile.experience,
    job.title
  );

  const educationScore = calculateEducationMatch(
    studentProfile.education,
    job.title
  );

  const locationScore = calculateLocationMatch(
    studentProfile.location,
    studentProfile.workMode,
    job.location,
    job.workMode
  );

  const finalScore = Math.round(
    skillScore * 0.60 +
    experienceScore * 0.20 +
    educationScore * 0.10 +
    locationScore * 0.10
  );

  const reasons = [];

if (skillScore >= 80) {
  reasons.push("Strong skill match");
} else if (skillScore >= 50) {
  reasons.push("Moderate skill match");
}

if (experienceScore === 100) {
  reasons.push("Relevant experience");
}

if (educationScore === 100) {
  reasons.push("Relevant education");
}

if (locationScore === 100) {
  reasons.push("Location/work mode matches");
}

  return {
    jobId: job._id,
    jobTitle: job.title,
    company: job.company,
    skillScore,
    experienceScore,
    educationScore,
    locationScore,
    matchPercentage: finalScore,
    reasons
  };
};



module.exports = {
  calculateSkillMatch,
  calculateExperienceMatch,
  calculateEducationMatch,
  calculateLocationMatch,
  matchStudentWithJob
};