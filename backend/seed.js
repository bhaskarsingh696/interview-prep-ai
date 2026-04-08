const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
    topic: 'DSA',
    tags: ['Array', 'Hash Table'],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1]'
      }
    ],
    constraints: '2 <= nums.length <= 10^4',
    starterCode: {
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n}',
      python: 'def twoSum(nums, target):\n    # Write your code here\n    pass',
      javascript: 'function twoSum(nums, target) {\n    // Write your code here\n}'
    }
  },
  {
    title: 'Reverse a Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    difficulty: 'Easy',
    topic: 'DSA',
    tags: ['Linked List', 'Recursion'],
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'The linked list is reversed'
      }
    ],
    constraints: 'The number of nodes in the list is in the range [0, 5000]',
    starterCode: {
      cpp: 'ListNode* reverseList(ListNode* head) {\n    // Write your code here\n}',
      python: 'def reverseList(head):\n    # Write your code here\n    pass',
      javascript: 'function reverseList(head) {\n    // Write your code here\n}'
    }
  },
  {
    title: 'What is a Deadlock?',
    description: 'Explain the concept of deadlock in Operating Systems. What are the four necessary conditions for deadlock to occur?',
    difficulty: 'Medium',
    topic: 'OS',
    tags: ['Deadlock', 'Process Management'],
    examples: [
      {
        input: 'Two processes each waiting for a resource held by the other',
        output: 'Deadlock situation',
        explanation: 'Neither process can proceed'
      }
    ],
    constraints: 'Explain all four Coffman conditions',
    starterCode: {
      cpp: '// Write your explanation as comments',
      python: '# Write your explanation as comments',
      javascript: '// Write your explanation as comments'
    }
  },
  {
    title: 'What is Normalization?',
    description: 'Explain database normalization. What are 1NF, 2NF, and 3NF? Give examples.',
    difficulty: 'Medium',
    topic: 'DBMS',
    tags: ['Normalization', 'SQL'],
    examples: [
      {
        input: 'Unnormalized table with repeating groups',
        output: 'Normalized tables in 3NF',
        explanation: 'Remove redundancy and improve data integrity'
      }
    ],
    constraints: 'Cover all three normal forms with examples',
    starterCode: {
      cpp: '// Write your explanation as comments',
      python: '# Write your explanation as comments',
      javascript: '// Write your explanation as comments'
    }
  },
  {
    title: 'TCP vs UDP',
    description: 'Explain the difference between TCP and UDP protocols. When would you use each one?',
    difficulty: 'Easy',
    topic: 'CN',
    tags: ['TCP', 'UDP', 'Protocols'],
    examples: [
      {
        input: 'Video streaming application',
        output: 'UDP is preferred',
        explanation: 'Speed is more important than reliability for streaming'
      }
    ],
    constraints: 'Cover connection, reliability, speed, and use cases',
    starterCode: {
      cpp: '// Write your explanation as comments',
      python: '# Write your explanation as comments',
      javascript: '// Write your explanation as comments'
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    await Problem.deleteMany({});
    console.log('🗑️ Old problems deleted');

    await Problem.insertMany(problems);
    console.log('✅ 5 Problems added successfully!');

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedDB();