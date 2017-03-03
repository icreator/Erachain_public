# Private and Publick key class

public class Account {
	
	public static final int ADDRESS_LENGTH = 25;
	//private static final long ERM_KEY = Transaction.RIGHTS_KEY;
	private static final long FEE_KEY = Transaction.FEE_KEY;
	//public static final long ALIVE_KEY = StatusCls.ALIVE_KEY;
	public static String EMPTY_PUBLICK_ADDRESS = new PublicKeyAccount(new byte[PublicKeyAccount.PUBLIC_KEY_LENGTH]).getAddress();


	protected String address;
	
	//private byte[] lastBlockSignature;
	//private long generatingBalance; //used  for forging balance
	
	protected Account()
	{
		//this.generatingBalance = 0l;
	}
	
	public Account(String address)
	{

		// ///test address
		assert(Base58.decode(address) instanceof byte[] );
		
		this.address = address;
	}
	
	public static Tuple2<Account, String> tryMakeAccount(String address) {
		
		boolean isBase58 = false;
		try
		{
			Base58.decode(address);
			isBase58 = true;
		}
		catch(Exception e)
		{
			if (PublicKeyAccount.isValidPublicKey(address)) {
				// MAY BE IT BASE.32 +
				return new Tuple2<Account, String>(new PublicKeyAccount(address), null);
			}
		}

		if (isBase58) {
			//ORDINARY RECIPIENT
			if(Crypto.getInstance().isValidAddress(address)) {
				return new Tuple2<Account, String>(new Account(address), null);
			} else if (PublicKeyAccount.isValidPublicKey(address)) {
				return new Tuple2<Account, String>(new PublicKeyAccount(address), null);
			} else {
				return new Tuple2<Account, String>(null, "Wrong Address or PublickKey");
			}
		} else {
			//IT IS NAME - resolve ADDRESS
			Pair<Account, NameResult> result = NameUtils.nameToAdress(address);
			
			if(result.getB() == NameResult.OK)
			{
				return new Tuple2<Account, String>(result.getA(), null);
			} else		
			{
				return new Tuple2<Account, String>(null, "The name is not registered");
			}
		}

	}
	public String getAddress()
	{
		return address;
	}
