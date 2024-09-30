const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Student {
    id: ID!
    name: String!
    joiningDate: String!
    contactInfo: String!
    class: String!
    timeSlot: String!
    feesRecords: [FeesRecord!]!
  }

  type FeesRecord {
    id: ID!
    studentId: ID!
    amount: Float!
    month: String!
    year: Int!
    status: String! # Paid/Unpaid
  }

  type Query {
    getStudentById(id: ID!): Student
    getAllStudents: [Student!]
    getFeesRecords(studentId: ID!): [FeesRecord!]
    studentsByTimeSlot(timeSlot: String!): [Student!]!
  }

  input CreateStudentInput {
    name: String!
    joiningDate: String!
    contactInfo: String!
    class: String!
    timeSlot: String!
  }

  type Mutation {
    createStudent(input: CreateStudentInput!): Student
    updateStudent(
      id: ID!
      name: String
      contactInfo: String
      class: String
      timeSlot: String
    ): Student
    deleteStudent(id: ID!): String
    createFeesRecord(
      studentId: ID!
      amount: Float!
      month: String!
      year: Int!
      status: String!
    ): FeesRecord
    updateFeesRecord(id: ID!, amount: Float, status: String): FeesRecord
  }
`;

module.exports = typeDefs;
