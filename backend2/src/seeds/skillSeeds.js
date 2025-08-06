require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('../models/skillModel');
const { connectDB } = require('../config/database');

// Array of skills by category
const skillsData = [
  // Technical Skills
  { name: 'JavaScript', category: 'Programming Languages' },
  { name: 'Python', category: 'Programming Languages' },
  { name: 'Java', category: 'Programming Languages' },
  { name: 'C++', category: 'Programming Languages' },
  { name: 'Ruby', category: 'Programming Languages' },
  { name: 'PHP', category: 'Programming Languages' },
  { name: 'Swift', category: 'Programming Languages' },
  { name: 'Kotlin', category: 'Programming Languages' },
  { name: 'TypeScript', category: 'Programming Languages' },
  { name: 'Go', category: 'Programming Languages' },
  { name: 'Rust', category: 'Programming Languages' },
  
  // Web Development
  { name: 'React', category: 'Web Development' },
  { name: 'Angular', category: 'Web Development' },
  { name: 'Vue.js', category: 'Web Development' },
  { name: 'Node.js', category: 'Web Development' },
  { name: 'Express.js', category: 'Web Development' },
  { name: 'Django', category: 'Web Development' },
  { name: 'Flask', category: 'Web Development' },
  { name: 'Ruby on Rails', category: 'Web Development' },
  { name: 'HTML', category: 'Web Development' },
  { name: 'CSS', category: 'Web Development' },
  { name: 'SASS/SCSS', category: 'Web Development' },
  { name: 'Bootstrap', category: 'Web Development' },
  { name: 'Tailwind CSS', category: 'Web Development' },
  
  // Mobile Development
  { name: 'React Native', category: 'Mobile Development' },
  { name: 'Flutter', category: 'Mobile Development' },
  { name: 'iOS Development', category: 'Mobile Development' },
  { name: 'Android Development', category: 'Mobile Development' },
  { name: 'Xamarin', category: 'Mobile Development' },
  
  // Database
  { name: 'SQL', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'Cassandra', category: 'Database' },
  { name: 'DynamoDB', category: 'Database' },
  { name: 'Firebase', category: 'Database' },
  
  // DevOps
  { name: 'Docker', category: 'DevOps' },
  { name: 'Kubernetes', category: 'DevOps' },
  { name: 'AWS', category: 'DevOps' },
  { name: 'Azure', category: 'DevOps' },
  { name: 'Google Cloud', category: 'DevOps' },
  { name: 'Jenkins', category: 'DevOps' },
  { name: 'CI/CD', category: 'DevOps' },
  { name: 'Terraform', category: 'DevOps' },
  { name: 'Ansible', category: 'DevOps' },
  
  // Data Science
  { name: 'Machine Learning', category: 'Data Science' },
  { name: 'Deep Learning', category: 'Data Science' },
  { name: 'TensorFlow', category: 'Data Science' },
  { name: 'PyTorch', category: 'Data Science' },
  { name: 'Data Analysis', category: 'Data Science' },
  { name: 'Data Visualization', category: 'Data Science' },
  { name: 'Pandas', category: 'Data Science' },
  { name: 'NumPy', category: 'Data Science' },
  { name: 'R', category: 'Data Science' },
  
  // Soft Skills
  { name: 'Leadership', category: 'Soft Skills' },
  { name: 'Communication', category: 'Soft Skills' },
  { name: 'Teamwork', category: 'Soft Skills' },
  { name: 'Problem Solving', category: 'Soft Skills' },
  { name: 'Critical Thinking', category: 'Soft Skills' },
  { name: 'Time Management', category: 'Soft Skills' },
  { name: 'Adaptability', category: 'Soft Skills' },
  { name: 'Creativity', category: 'Soft Skills' },
  { name: 'Emotional Intelligence', category: 'Soft Skills' },
  
  // Project Management
  { name: 'Agile', category: 'Project Management' },
  { name: 'Scrum', category: 'Project Management' },
  { name: 'Kanban', category: 'Project Management' },
  { name: 'JIRA', category: 'Project Management' },
  { name: 'Trello', category: 'Project Management' },
  { name: 'Asana', category: 'Project Management' },
  { name: 'Project Planning', category: 'Project Management' },
  { name: 'Risk Management', category: 'Project Management' },
  
  // Design
  { name: 'UI Design', category: 'Design' },
  { name: 'UX Design', category: 'Design' },
  { name: 'Graphic Design', category: 'Design' },
  { name: 'Figma', category: 'Design' },
  { name: 'Adobe XD', category: 'Design' },
  { name: 'Sketch', category: 'Design' },
  { name: 'Photoshop', category: 'Design' },
  { name: 'Illustrator', category: 'Design' },
  
  // Marketing
  { name: 'Digital Marketing', category: 'Marketing' },
  { name: 'SEO', category: 'Marketing' },
  { name: 'Social Media Marketing', category: 'Marketing' },
  { name: 'Content Marketing', category: 'Marketing' },
  { name: 'Email Marketing', category: 'Marketing' },
  { name: 'Google Analytics', category: 'Marketing' },
  { name: 'Market Research', category: 'Marketing' },
  { name: 'Brand Management', category: 'Marketing' },
];

// Function to seed skills
const seedSkills = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Delete existing skills
    await Skill.deleteMany({});
    console.log('Deleted existing skills');
    
    // Insert new skills
    await Skill.insertMany(skillsData);
    console.log(`Inserted ${skillsData.length} skills`);
    
    console.log('Skills seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding skills:', error);
    process.exit(1);
  }
};

// Run the seeder
seedSkills();