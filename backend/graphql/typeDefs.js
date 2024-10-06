const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date
  type Student {
    id: ID!
    name: String!
    joiningDate: String!
    contactInfo: String!
    class: String!
    feesAmount: Float! 
    notes: String
    timeSlot: String!
    feesRecords: [FeesRecord!]!
    isActive: Boolean!
  }

  type FeesRecord {
    id: ID!
    studentId: ID!
    studentName: String!
    amount: Float!
    date_of_payment: Date!
    status: String!
  }

  type MonthlyFeesReport {
    paidFeesCount: Int!
    unpaidFeesCount: Int!
    paidStudents: [FeesRecord!]!
    unpaidStudents: [Student!]!
  }

  type Query {
    getStudentById(id: ID!): Student
    getAllStudents: [Student!]
    getFeesRecords(studentId: ID!): [FeesRecord!]
    studentsByTimeSlot(timeSlot: String!): [Student!]!
    getMonthlyFeesReport(year: Int!, month: Int!): MonthlyFeesReport!
  }

  input CreateStudentInput {
    name: String!
    joiningDate: String!
    contactInfo: String!
    class: String!
    feesAmount: Float!
    notes: String
    timeSlot: String!
  }

  type Mutation {
    createStudent(input: CreateStudentInput!): Student
    updateStudent(
      id: ID!
      name: String
      contactInfo: String
      class: String
      feesAmount: Float
      notes: String
      timeSlot: String
    ): Student
    deleteStudent(id: ID!): String
    createFeesRecord(
      studentId: ID!
      studentName: String!
      amount: Float!
      date_of_payment: Date!
      status: String!
    ): FeesRecord
    updateFeesRecord(id: ID!, amount: Float, status: String): FeesRecord
    toggleStudentActive(id: ID!): Student
  }
`;

module.exports = typeDefs;
