import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { CalculatorApp } from '../target/types/calculator_app';
import * as assert from 'assert';
const {SystemProgram} = anchor.web3;

describe('calculator-app', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider)

  const calculator = anchor.web3.Keypair.generate();
  let _calculator;
  const program = anchor.workspace.CalculatorApp as Program<CalculatorApp>;

  it("Creates a calculator",async()=>{
    await program.rpc.create("Welcome to Solana",{
      accounts: {
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [calculator]
    })

    const account = await program.account.calculator.fetch(calculator.publicKey);
    console.log(account)
    assert.ok(account.greeting === "Welcome to Solana");
    _calculator = calculator
  })

  it("Adds 2 numbers",async()=>{
    const calculator = _calculator;
    await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(5)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Mults 2 numbers",async()=>{
    const calculator = _calculator;
    await program.rpc.multiply(new anchor.BN(2), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(6)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Subtracts 2 numbers",async()=>{
    const calculator = _calculator;
    await program.rpc.subtract(new anchor.BN(3), new anchor.BN(2), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(1)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

  it("Divides 2 numbers",async()=>{
    const calculator = _calculator;
    await program.rpc.divide(new anchor.BN(6), new anchor.BN(3), {
      accounts: {
        calculator: calculator.publicKey,
      },
    });

    const account = await program.account.calculator.fetch(calculator.publicKey);
    assert.ok(account.result.eq(new anchor.BN(2)));
    assert.ok(account.remainder.eq(new anchor.BN(0)));
    assert.ok(account.greeting === "Welcome to Solana");
  })

})
