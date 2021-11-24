const anchor = require('@project-serum/anchor');

// Need the system program, will talk about this soon.
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  // Create and set the provider. We set it before but we needed to update it, so that it can communicate with our frontend!
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  //Note: Naming + folder structure is mega important here. Ex. Anchor knows to look at programs/myepicproject/src/lib.rs b/c we used anchor.workspace.Myepicproject.  
  const program = anchor.workspace.Myepicproject; // Compile and deploy lib.rs

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();  

   // Call start_stuff_off, pass it the params it needs!
   // Note: notice also that in lib.rs the function is called start_stuff_off since in Rust we use _ vs camel case. 
   // But, over in our javascript file we use camel case and actually call startStuffOff. This is something nice Anchor 
   // does for us so we can follow best practices regardless of what language we're using. You can use underscores 
   // in Rust-land and camel case in JS-land.
   let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

    // Call add_gif!
    await program.rpc.addGif("https://giphy.com/gifs/madonna-lucky-star-7TqT2kOgeGcP1FZJvt",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    
    // Get the account again to see what changed.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log('👀 GIF Count', account.totalGifs.toString())

    // Access gif_list on the account!
    console.log('👀 GIF List', account.gifList)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();